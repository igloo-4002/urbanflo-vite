import {
  CanvasItemType,
  type CanvasItemTypes,
  type Car,
  type Intersection,
  type Road,
} from "../../context/types";
import { Car as CarComponent } from "./Car";
import { Road as RoadComponent } from "./Road";

export function isRoad(canvasItem: CanvasItemTypes): canvasItem is Road {
  return canvasItem.info.type === CanvasItemType.ROAD;
}

export function isIntersection(
  canvasItem: CanvasItemTypes,
): canvasItem is Intersection {
  return canvasItem.info.type === CanvasItemType.TRAFFIC_LIGHT;
}

export function isCar(canvasItem: CanvasItemTypes): canvasItem is Car {
  return canvasItem.info.type === CanvasItemType.CAR;
}

type CanvasItemRenderElement<T> = {
  element: T;
  canvasItemsIndex: number;
};

function filterCanvasItems<T>(
  canvasItems: CanvasItemTypes[],
  predicate: (item: CanvasItemTypes) => boolean,
): CanvasItemRenderElement<T>[] {
  const items: CanvasItemRenderElement<T>[] = [];

  for (let i = 0; i < canvasItems.length; i++) {
    if (predicate(canvasItems[i])) {
      items.push({ element: canvasItems[i] as T, canvasItemsIndex: i });
    }
  }

  return items;
}

export function renderCanvasItems(canvasItems: CanvasItemTypes[]) {
  const cars = filterCanvasItems<Car>(canvasItems, isCar);
  const roads = filterCanvasItems<Road>(canvasItems, isRoad);
  const _intersections = filterCanvasItems<Road>(canvasItems, isIntersection);

  return (
    <>
      {roads.map((road: CanvasItemRenderElement<Road>) => {
        const currentRoad = canvasItems[road.canvasItemsIndex] as Road;

        return (
          <RoadComponent
            key={road.canvasItemsIndex}
            roadFields={{
              direction: currentRoad.direction,
              speedLimit: currentRoad.speedLimit,
              lanes: currentRoad.lanes,
              length: currentRoad.length,
            }}
            canvasProps={{
              index: road.canvasItemsIndex,
              x: road.element.props.x,
              y: road.element.props.y,
              draggable: road.element.props.draggable,
              offsetX: road.element.props.offsetX,
              offsetY: road.element.props.offsetY,
            }}
          ></RoadComponent>
        );
      })}

      {/* Render cars at the end so they are above all other items in terms */}
      {cars.map((car: CanvasItemRenderElement<Car>) => {
        const currentCar = canvasItems[car.canvasItemsIndex] as Car;

        return (
          <CarComponent
            key={car.canvasItemsIndex}
            carFields={{
              speed: currentCar.speed,
              direction: currentCar.direction,
            }}
            canvasProps={{
              index: car.canvasItemsIndex,
              x: car.element.props.x,
              y: car.element.props.y,
              draggable: car.element.props.draggable,
              offsetX: car.element.props.offsetX,
              offsetY: car.element.props.offsetY,
            }}
          ></CarComponent>
        );
      })}
    </>
  );
}
