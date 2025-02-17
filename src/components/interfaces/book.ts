export interface IBook {
    _id: string;
    userId: string;
    course: string;
    std: string;
    year: string;
    semester: string;
    isSet: string;
    books: {name : string, price : number, halfPrice : number}[];
    seller: {
      name: string;
      city: string;
      college: string;
      university: string;
    };
    totalPrice: number;
  }