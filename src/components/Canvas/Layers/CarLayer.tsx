import { Layer } from 'react-konva';

import { useCarsStore } from '~/zustand/useCarStore';

import { Car } from '../Car';

export function CarLayer() {
  const carStore = useCarsStore();

  return (
    <Layer>
      {carStore.cars.map((car, index) => {
        return <Car car={car} key={index} />;
      })}
    </Layer>
  );
}
