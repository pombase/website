export class GeneDetails {
  uniquename: string;
  name: string;
  constructor (geneData: any) {
    this.uniquename = geneData.uniquename;
    this.name = geneData.name;
  }
}
