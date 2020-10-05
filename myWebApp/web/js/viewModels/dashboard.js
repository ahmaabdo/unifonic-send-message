define(['accUtils', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojmessages',
  'ojs/ojknockout', 'ojs/ojfilepicker', 'ojs/ojinputtext', 'ojs/ojformlayout', 'ojs/ojvalidationgroup',
  'ojs/ojlabel', 'ojs/ojcheckboxset', 'ojs/ojselectcombobox', 'ojs/ojbutton'],
  function (accUtils, ko, ArrayDataProvider) {
    function DashboardViewModel() {
      var self = this;
      var formdata;
      var restUrl = "https://sample-upload-multer.herokuapp.com/";
      // var restUrl = "http://localhost:5000/";

      self.sendBtnDisabled = ko.observable(false);
      self.type = ko.observable("image");
      self.channel = ko.observable("whatsapp");
      self.fileName = ko.observable([]);

      self.notifMessage = ko.observableArray();
      self.messagesDataprovider = new ArrayDataProvider(self.notifMessage);
      self.newNotificationMsg = function (type, msg) {
        self.notifMessage.push({
          severity: type,
          summary: msg,
          detail: '',
          autoTimeout: 5000
        });
      };

      // self.newNotificationMsg('error', 'Please enter a value');
      // self.newNotificationMsg('warning', 'Please enter a value');
      // self.newNotificationMsg('confirmation', 'Please enter a value');
      // self.newNotificationMsg('info', 'Please enter a value');

      self.callPostService = function (serviceUrl, payload) {
        var payloadStr = '';
        if (typeof payload === 'string' || payload instanceof String) {
          payloadStr = payload;
        } else {
          payloadStr = JSON.stringify(payload);
        }
        var defer = $.Deferred();
        $.ajax({
          type: "POST",
          async: true,
          headers: {},
          url: serviceUrl,
          contentType: 'application/json',
          data: payloadStr,
          success: function (data) {
            defer.resolve(data);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            defer.reject(xhr);
          }
        });
        return $.when(defer);
      };

      function blobToFile(theBlob, fileName) {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
      }

      self.selectListener = function (event) {
        var files = event.detail.files;
        formdata = new FormData();
        formdata.append('imgUploader', files[0]);

        self.fileName(files[0].name);
      }.bind(this);

      var failed = function (err) {
        console.log(err);
        self.newNotificationMsg('error', 'An unknown error has occurred.');
      }
      self.sendBtnClickAction = async () => {

        if (!self.fileName().length) {
          self.newNotificationMsg('error', 'Please select a valid file');
          return;
        }

        self.sendBtnDisabled(true);

        // var payload = {
        //   "contact": "+201003053606",
        //   "channel": self.channel(),
        //   "type": self.type(),
        // };

        // await self.callPostService(restUrl + "api/objData", payload).then({}, failed);

        await $.ajax({
          type: "POST",
          async: true,
          headers: {},
          url: restUrl + "api/sendMessage/" + "+201003053606" + "/" + self.channel() + "/" + self.type(),
          contentType: false,
          processData: false,
          data: formdata,
          success: function (data) {
            if (data)
              self.newNotificationMsg('info', JSON.parse(data).message);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr)
          }
        }).then({}, failed);;

        self.sendBtnDisabled(false);
      };



      self.connected = () => {
        accUtils.announce('Unifonic - Send Message page loaded.');
        document.title = "Unifonic - Send Message";
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
