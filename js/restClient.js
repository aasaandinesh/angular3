/**
 * Created by dineshsingh on 02/12/15.
 */

/*
A property inheritsFrom is defined to make the inheritance easier.
 */
Function.prototype.inheritsFrom = function (parentClassOrObject) {
    if (parentClassOrObject.constructor == Function) {
        //Normal Inheritance
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    }
    else {
        //Pure Virtual Inheritance
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }
    return this;
};

/*
Defining the base model. My idea is to create an ORM type stuff in Javascript. Write down most of the boilerplate code
in the basemodel. All of the other models inherits from this model. All the Boilerplate code of making a GET/POST request
is being written down in the basemodel.
 */
BaseModel = function () {
    //Default URL to be used in case GET/POST URLs are not defined. In ideal RESTful world, there will be single URL for
    // GET/PUT/POST etc. for an entity
    this.url = "";

    //URL for GET. Need to be initialized only if it is different
    this.getUrl = "";

    //URL for POST. Need to be initialized only if it is different
    this.postUrl = "";

    //URL for PUT. Need to be initialized only if it is different
    this.putUrl = "";

    //URL for PATCH. Need to be initialized only if it is different
    this.patchUrl = "";

    //Headers which need to be sent. By Default we will not be sending any headers. If it is required to send a common
    //headers for all the requests then we can create another layer of model and override the headers and let other
    //models extend this model
    this.headers = {};

    //This method converts this object to JSON, so that it can be sent as requestbody if required. Will be required in
    //case of POST and PUT
    this.getJson = function () {
        return JSON.parse(JSON.stringify(this));
    };


    //Method which provides GET functionality
    this.get = function (callbackMethod, headers) {
        sendRequest(callbackMethod, 'GET', this.getUrl, {}, headers);

    };

    //Method which provides POST functionality
    this.post = function (callbackMethod, headers) {
        console.log(this);
        sendRequest(callbackMethod, 'POST', this.postUrl, this.getJson(), headers);

    };

    this.put = function (callbackMethod, headers, data) {
        sendRequest(callbackMethod, 'PUT', this.putUrl, data, headers);

    };

    //Common method though which all of the requests will be made
    function sendRequest(callbackMethod, type, url, data, headers) {
        $.ajax({
            url: url,
            type: type,
            success: callbackMethod,
            headers: headers,
            data: data
        });
    }

};


/*
Seeing its usage
 */

/*
Define a POJO like object. Also mention URLs
 */
CandidateModel = function () {
    //Overriding the get url
    this.getUrl = "http://jsonplaceholder.typicode.com/posts";

    //Overriding the post url
    this.postUrl = "http://jsonplaceholder.typicode.com/posts";

    // Varioud fields of the model
    this.name = "";
    this.isVerified = "";
    this.anotherField = "";
};

//Inherit it from BaseModel
CandidateModel.inheritsFrom(BaseModel);


var candidate = new CandidateModel();

//If we need to get the candidates, it's as simple as that.
candidate.get(function (response) {
    console.log(response);
});

//If we need to create a new candidate.
candidate.name = "Dinesh Singh";
candidate.isVerified = true;
candidate.anotherField = "Another field";


//Just call the post method and request will be sent to the server.

candidate.post(function (response) {

});


