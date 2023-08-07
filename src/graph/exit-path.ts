import { GraphItem } from '~/context/types';

export class ExitPath {
  start: GraphItem;
  end: GraphItem;

  constructor(start: GraphItem, end: GraphItem) {
    this.start = start;
    this.end = end;
  }
}
