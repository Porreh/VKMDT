class Downloader {
  constructor(linkList) {
    this.linkList = linkList;
  }

  saveFile(url) {
    let filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open('GET', url);
    xhr.send();
  }

  getFiles(linkList) {
    for(let link of (this.linkList || linkList)) {
      this.saveFile(link);
      console.log(link);
    }
  }
}

class Parser {
  constructor() {

  }

  split() {

  }

}

class LinkGenerator {
  constructor() {

  }
}

class VKData {
  constructor() {
    this.id;
  }

  logIn(response) {
    if(response.status == 'connected') {
      VK.Api.call('users.get', { uid: response.session.mid }, function(r) { 
        let id = r.response[0];
        this.id = id;
      });
    } else {
      VK.Auth.login(this.logIn);
    }
  }

  start() {
    VK.Auth.getLoginStatus(this.logIn);
  }
}

let data = new VKData();
data.start();

// VK.Auth.getLoginStatus(x => console.log(x.session.mid));
