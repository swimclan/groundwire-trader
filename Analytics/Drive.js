var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var config = require('../config');
var json2csv = require('json2csv');

class Drive {
  constructor() {
    this.oauth;
    this.file;
  }

  authorize() {    
    var clientSecret = config.get('google.oauth_client').installed.client_secret;
    var clientId = config.get('google.oauth_client').installed.client_id;
    var redirectUrl = config.get('google.oauth_client').installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    oauth2Client.credentials = config.get('google.oauth_token');
    this.oauth = oauth2Client;
    return this
  }

  create(title) {
    return new Promise((resolve, reject) => {
      var service = google.drive('v2');
      var fileMetadata = {
        'title': title,
        'mimeType': 'application/vnd.google-apps.spreadsheet'
      };
      service.files.insert({
        auth: this.oauth,
        resource: fileMetadata,
        fields: 'id'
      }, 
      (err, file) => {
        if (err) {
          reject(err);
        } else {
          this.file = file.id;
          resolve(this);
        }
      });
    });
  }

  update(fields, data) {
    return new Promise((resolve, reject) => {
      var csv = json2csv({data: data, fields: fields});
      var service = google.drive('v2');
      var media = {
        mimeType: 'text/csv',
        body: csv
      };
      service.files.update({
        auth: this.oauth,
        fileId: this.file,
        media: media
      },
      (err, file) => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }
}

module.exports = Drive;