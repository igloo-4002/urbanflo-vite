import { Intersection, Road } from '~/context/types';

export class ExitPath {
  start: Intersection;
  end: Intersection;
  connector: Road;

  constructor(start: Intersection, end: Intersection, connector: Road) {
    this.start = start;
    this.end = end;
    this.connector = connector;
  }
}
