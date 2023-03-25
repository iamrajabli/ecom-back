export class ReviewOfBookDto {
  star: number;
  comment: string;
  name: string;

  constructor(star: number, comment: string, name: string) {
    this.star = star;
    this.comment = comment;
    this.name = name;
  }
}
