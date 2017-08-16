describe('In class End to End Exercise', function() {
    'use strict'

    beforeEach(function() {
        browser.get('/')
        login();
    })

    it('should login in', function() {
        expect(browser.getCurrentUrl()).toBe("http://localhost:8080/#/main");
    })

    it('should register a new user', function() {
        browser.get('/')
        register();
    })

    it('should create a new post and validate the post appears in the feed', function() {
        //Select all the post textarea
        element.all(by.css('textarea')).first().sendKeys("This is a new Post!");
        //Click the post button
        element(by.css('[ng-click="vm.addPost(vm.post_body)"]')).click();
        //Find that first row which contains the posted post
        var firstPost = element.all(by.repeater('post in vm.posts').row(0).column("post.body"));
        firstPost.getText().then(function(result) {
            //must be resolved to verify the content
            expect(result[0]).toEqual('This is a new Post!')
        })
    })

    it('should update the status headline and verify the change', function() {
        // Find the status text field and fill it in
        element(by.css('[ng-model="vm.newStatus"]')).sendKeys("This is a new Status!");
        // Click update button
        element(by.css('[ng-click="vm.updateStatus(vm.newStatus)"]')).click();
        // Get the status headline label and verify
        expect(element(by.id('status')).getText()).toEqual("This is a new Status!");
    })

    it('should count the number of followed users', function() {
        // Count the current followers
        var count = element.all(by.repeater("follower in vm.followers")).count();
        expect(element.all(by.repeater("follower in vm.followers")).count()).toBe(count);
        expect(element.all(by.repeater("follower in vm.followers")).count()).toBeDefined();
    })

    it('should add the user "Follower" to the list of followed users and verify the count increases by one', function() {
        // Get current number of followers
        var count = element.all(by.repeater("follower in vm.followers")).count();
        // Fill in the text field
        element(by.css('[ng-model="vm.newFollower"]')).sendKeys('Follower');
        // click add button and verify
        element(by.css('[ng-click="vm.addFollower(vm.newFollower)"]')).click();
        count.then(function(result) {
            expect(element.all(by.repeater("follower in vm.followers")).count()).toBe(result + 1);
        })
    })

    it('should remove the user "Follower" from the list of followed users and verify the count decreases by one', function() {
        // Count the number of current followers
        var count = element.all(by.repeater("follower in vm.followers")).count();
        count.then(function(result) {
            // Get every follower
            element.all(by.repeater('follower in vm.followers')).then(function(followers) {
                // Scan followers until user "Follower" is found
                followers.forEach(function(follower) {
                    var text = follower.element(by.binding("follower.username"));
                    text.getText().then(function(result) {
                        // If found, delete it and verify
                        if (result == "Follower") {
                            follower.element(by.css('a.btn')).click();
                            expect(element.all(by.repeater("follower in vm.followers")).count()).toBe(result - 1)
                        }
                    })
                })

            });
        })
    })

    it('should search for "Only One Post Like This" and verify only one post shows, and verify the author', function() {
        // Search the post and verify only one post appears
        element(by.css('[ng-model="vm.searchKeyword"]')).sendKeys("Only One Post Like This");
        expect(element.all(by.repeater("post in vm.posts")).count()).toBe(1);
        expect(element(by.binding('post.author')).getText()).toContain("Author:gl22test");
    })

    it('should navigate to the profile view and verify the page is loaded', function() {
        // Click the profile button verify redirecting page
        element(by.css('[href="#/profile"]')).click();
        expect(browser.getCurrentUrl()).toBe("http://localhost:8080/#/profile");
    })

    it('should test email, zipcode and password', function() {
        // Make sure we are at the profile page
        element(by.css('[href="#/profile"]')).click();
        var newemail;
        var newzipcode;
        var newpassword = 's332';
        // Get the old zipcode and email
        var oldzipcode = element(by.binding('vm.zipcodeInfo')).getText();
        var oldemail = element(by.binding('vm.emailInfo')).getText();

        oldzipcode.then(function(zipcode) {
            //make sure the newzipcode is different from the old one
            newzipcode = zipcode == "11111" ? "77005" : "11111";
            element(by.id('zipcode')).sendKeys(newzipcode);
        })
        oldemail.then(function(email) {
            //make sure the new email is different from the old one
            newemail = email == "gl22@rice.edu" ? "ms11@rice.edu" : "gl22@rice.edu";
            element(by.id('email')).sendKeys(newemail);
        })
        // Send the new profile and update
        element(by.id('name')).sendKeys("scott");
        element(by.id('password')).sendKeys(newpassword);
        element(by.id('repassword')).sendKeys(newpassword);
        element(by.css('[ng-click="vm.update()"]')).click();

        element(by.binding('vm.zipcodeInfo')).getText().then(function(zipcode) {
            // Verify zipcode has been changed
            expect(zipcode.substring(10)).toBe(newzipcode);
        })
        element(by.binding('vm.emailInfo')).getText().then(function(email) {
            // Verify email has been changed
            expect(email.substring(7)).toBe(newemail);
        })
        // Verify message received from the server, password will not change
        expect(element(by.binding('vm.passwordstatus')).getText()).toBe("will not change");
    })

    function register() {
        element(by.model('vm.name')).sendKeys('gl22');
        element(by.model('vm.email')).sendKeys('gl22@rice.edu');
        element(by.model('vm.zipcode')).sendKeys('77005');
        element(by.model('vm.password')).sendKeys('1234');
        element(by.model('vm.repassword')).sendKeys('1234');
        element(by.css('[ng-click="vm.register()"]')).click();
        browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
        var alertDialog = browser.switchTo().alert();
        expect(alertDialog.getText()).toEqual("Welcome gl22!");
        alertDialog.accept();
    }

    function login() {
        element(by.model('vm.username')).sendKeys('gl22test')
        element(by.model('vm.loginPassword')).sendKeys('edge-someone-please')

        expect(element(by.model('vm.username')).getAttribute('value')).toEqual('gl22test');
        expect(element(by.model('vm.loginPassword')).getAttribute('value')).toEqual('edge-someone-please');
        // click the login button
        element(by.id('button_login')).click();
        expect(browser.getCurrentUrl()).toBe("http://localhost:8080/#/main");
    }

    function logout() {
        element(by.id('button_logout')).click();
    }
})
