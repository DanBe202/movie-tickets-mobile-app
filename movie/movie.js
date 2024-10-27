export class Movie {
    name = '';
    seats;
    seatsBooked = 0;

    constructor(name, seats, seatsBooked) {
        this.name = name;
        this.seats = seats
        if (seatsBooked) {
            this.seatsBooked = seatsBooked
        }
    }

    getRemainingSeats() {
        return this.seats - this.seatsBooked;
    }

    bookSeats(numSeats) {
        if (this.seatsBooked + numSeats <= this.seats) {
            this.seatsBooked += numSeats;
            return true;
        }
        return false;
    }
}