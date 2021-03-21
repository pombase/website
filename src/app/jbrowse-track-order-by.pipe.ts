import { Pipe, PipeTransform } from '@angular/core';
import { JBrowseTrackInfo } from './config';

function trackCompare(trackA: JBrowseTrackInfo, trackB: JBrowseTrackInfo,
                      fieldName: string): number {

  let direction = fieldName.charAt(0);
  if (direction === '+' || direction === '-') {
    fieldName = fieldName.substring(1);
  } else {
    direction = '+';
  }

  let fieldValueA = (trackA as any)[fieldName] as string|undefined;
  let fieldValueB = (trackB as any)[fieldName] as string|undefined;

  if (direction === '-') {
    const tmp = fieldValueB;
    fieldValueB = fieldValueA;
    fieldValueA = tmp;
  }

  if (fieldValueA === undefined || fieldValueA.length == 0) {
    if (fieldValueB === undefined || fieldValueB.length == 0) {
      return 0;
    } else {
      return 1;
    }
  } else {
    if (fieldValueB === undefined || fieldValueB.length == 0) {
      return -1
    } else {
      return fieldValueA.localeCompare(fieldValueB);
    }
  }
}


@Pipe({
  name: 'jbrowseTrackOrderBy'
})
export class JbrowseTrackOrderByPipe implements PipeTransform {

  transform(jbrowseTracks: Array<JBrowseTrackInfo>, fieldName: string): Array<JBrowseTrackInfo> {

    jbrowseTracks.sort((trackA, trackB) =>
                       trackCompare(trackA, trackB, fieldName));

    return jbrowseTracks;
  }
}
