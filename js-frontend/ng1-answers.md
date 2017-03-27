Angular 1.0.0 ~ 1.5.0
What is a directive, and what is the directive to add a template html?
Based on the version being asked, this could be ng-include (pre 1.5) or using a component syntax, would simply be <component name></component>

What is the difference between a Factory, Service and Provider?

What is dependancy Injection?

What is the controller?

Controllers are used to setup the inital state of the $scope object. It is also used to add behaviour on the $scope object.

What are Scopes in Angular?

What differences are between pre-1.5.0 and (1.5.0 above)?

The overall differences between pre-1.5.0 and post-1.5.0 is the overall shift from MVC to MVVM architecture. With pre-1.5.0, directives are declared with ng-include, whereas 1.5.0 mirrors more closely with Angular2's Component Style.

How would you declare a directive/component in 1.4 vs 1.5?

In Angular 1.5, how do you define data binding?

What is ng-app, and what does it do?

ng-app is the directive that allows the AngApplication to auto-bootstrap to the DOM. There is only one instance the the directive can be couple with the base HTML. When initialsing the application, you should declare teh various dependancies that are required within your app.js.

What is bootstrapping in Ang?
Bootstrapping is the initialisation process for the angular app.

What are filters and how would you use it?
Filters are used to format the value of an expression in the view template. There are a colleciton of built-in default filters provided by Angular, such as the json filter which can be used thus: {{ value | json }}.

To define a filter:

angular.module('appName', [])
  .filter('filterName', function() {
    return function(params) {
      return output;
    }
  });
What is Protractor and how would you use it?
Protractor is a Node.js end-to-end testing suite. The testing syntax is Jasmine which allows test hooks for the application to be tested E2E.

What is a model in Angular?

What is the module that you use for client side requests?

Author

©2016 Denis Tsoi