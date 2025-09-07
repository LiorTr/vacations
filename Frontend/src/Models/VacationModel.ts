export class VacationModel {
  _id: string
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  image: File | string;
  likesCount: number;
  likes: string[];
  constructor(vacation: VacationModel) {
    this.destination = vacation.destination;
    this.description = vacation.description;
    this.startDate = vacation.startDate;
    this.endDate = vacation.endDate;
    this.price = vacation.price;
    this.image = vacation.image;
  }
}
