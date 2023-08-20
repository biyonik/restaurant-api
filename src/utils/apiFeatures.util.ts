
export default class APIFeatures {
    constructor(public query: any, public queryString: any) {
        this.query = query;
        this.queryString = queryString;
    }    
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((field: any) => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match: any) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy); // sort('price ratingsAverage')
        } else {
        this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' '); // 'name price ratingsAverage'
        this.query = this.query.select(fields); // select('name price ratingsAverage')
        } else {
        this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        // page=2&limit=10
        const page = this.queryString.page * 1 || 1; // convert string to number
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit; // 1-10, page 1, 11-20, page 2, 21-30, page 3
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    count() {
        this.query = this.query.count();
        return this;
    }

    countDocuments() {
        this.query = this.query.countDocuments();
        return this;
    }

    find() {
        this.query = this.query.find();
        return this;
    }

    findOne() {
        this.query = this.query.findOne();
        return this;
    }

    findOneAndUpdate() {
        this.query = this.query.findOneAndUpdate();
        return this;
    }

    findOneAndDelete() {
        this.query = this.query.findOneAndDelete();
        return this;
    }

    populate() {
        this.query = this.query.populate();
        return this;
    }

    populateWith() {
        this.query = this.query.populateWith();
        return this;
    }

    populateWithSelect() {
        this.query = this.query.populateWithSelect();
        return this;
    }
}
