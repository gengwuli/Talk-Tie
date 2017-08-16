describe('Test post filter', function() {

    beforeEach(module('app'));
    
    //should passed in postFilterFilter instead of postFilter
    it("should only filter through author or body", inject(function(postFilterFilter) {
        //set default posts to be filtered
        var posts = [
            { author: "bengenmin", body: "Lightning Thunder", date: "03/16/2015", id: 1 },
            { author: "james", body: "your sins are forgiven", date: "03/15/2011", id: 2 },
            { author: "paul", body: "Go to church everyday", date: "07/18/2016", id: 3 },
            { author: "luke", body: "budda also good", date: "08/18/2018", id: 4 },
        ]

        //should not filter if the input is vacant
        expect(postFilterFilter(posts, '').length).toBe(4);
        //filtering by author
        expect(postFilterFilter(posts, 'bengenmin').length).toBe(1);
        //filtering by body
        expect(postFilterFilter(posts, 'forgiven').length).toBe(1);
        //should not filter through id
        expect(postFilterFilter(posts, 1).length).toBe(0);
        //should not filter through date
        expect(postFilterFilter(posts, '07/18/2016').length).toBe(0);
    }));
})
