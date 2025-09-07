
export interface VacationDto {
    _id: string;
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    image: string;
    likesCount: number;
    likes: any[];
}
