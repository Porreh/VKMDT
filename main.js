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

class VKI {
  constructor() {
  }

  logIn(response) {
    if(response.status == ('not_authorized' || 'unknown')) {
      VK.Auth.login(x => this.getID(x), 8);
    } else {
      console.log('already connected');
      VK.Auth.getLoginStatus(x => this.getID(x.session.mid));
    }
  }

  logOut() {
    VK.Auth.logout(x => console.log(x));
  }

  getStatus() {
    VK.Auth.getLoginStatus(x => console.log(x.status));
  }

  getID(userID) {
    VK.Api.call('users.get', { uid: userID }, function(r) { 
      console.log(r);
    });
  }

  start() {
    VK.Auth.getLoginStatus(this.logIn);
  }
}

let data = new VKI();

window.onload = function() {
  let btn = document.querySelector(".startbutton");
  btn.addEventListener("click", data.start(), false);
}
