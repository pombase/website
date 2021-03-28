export class TrackViewFeaturePart {
  constructor(public start: number, public end: number /*, padding: boolean */) {

  }

  public size(): number {
    return this.end - this.start + 1;
  }
}

export class TrackViewFeature {
  constructor(public id: string,
              public label: string,
              public parts: Array<TrackViewFeaturePart>) {

  }
}

export class TrackViewTrack {
  constructor(public label: string, public dbName: string, public features: Array<TrackViewFeature>) {

  }
}
