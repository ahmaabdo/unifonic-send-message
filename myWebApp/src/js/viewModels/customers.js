define(['accUtils', 'knockout', 'ojs/ojbootstrap',
  'ojs/ojknockout', 'ojs/ojfilepicker', 'ojs/ojinputtext',
  'ojs/ojlabel', 'ojs/ojcheckboxset'],
  function (accUtils, ko, Bootstrap) {
    function DashboardViewModel() {
      var self = this;

      self.multiple = ko.observableArray(['multiple']);
      self.multipleStr = ko.pureComputed(function () {
        return this.multiple()[0] ? 'multiple' : 'single';
      }.bind(this));

      self.disabled = ko.observableArray();
      self.isDisabled = ko.pureComputed(function () {
        return this.disabled()[0] === 'disable' ? true : false;
      }.bind(this));

      self.invalidMessage = ko.observable('');

      self.invalidListener = function (event) {
        self.fileNames([]);
        self.invalidMessage("{severity: '" + event.detail.messages[0].severity + "', summary: '"
          + event.detail.messages[0].summary + "'}");
        var promise = event.detail.until;
        if (promise) {
          promise.then(function () {
            self.invalidMessage('');
          }.bind(this));
        }
      }.bind(this);

      self.acceptStr = ko.observable('image/*');
      self.acceptArr = ko.pureComputed(function () {
        var accept = self.acceptStr();
        return accept ? accept.split(',') : [];
      }.bind(this));

      self.fileNames = ko.observable([]);

      self.selectListener = function (event) {
        self.invalidMessage('');
        var files = event.detail.files;
        self.fileNames(Array.prototype.map.call(files, function (file) {
          return file.name;
        }));
      }.bind(this);


      self.connected = () => {
        accUtils.announce('Customers page loaded.');
        document.title = "Customers";
      };


      self.disconnected = () => {
        // Implement if needed
      };

      self.transitionCompleted = () => {
        // Implement if needed
      };
    }


    return DashboardViewModel;
  }
);
