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
    this._id;
  }

  get uID() {
    return this._id;
  }

  set uID(newID) {
    this._id = newID;
  }

  getMusic() {
    VK.Api.call('users.get', {user_ids: this.uID}, function(r) {
      console.log(r);
    });
  }

  logIn(response) {
    if(response.status == ('not_authorized' || 'unknown')) {
      VK.Auth.login(this.logIn, 8);
    } else {
      console.log('already connected');
      this.uID = response.session.mid;
    }
  }

  logOut() {
    VK.Auth.logout(x => console.log(x));
  }

  checkStatus() {
    VK.Auth.getLoginStatus(this.logIn);
  }

  getStatus() {
    VK.Auth.getLoginStatus(x => console.log(x.status));
  }
}

let data = new VKI();
data.getMusic();

window.onload = function() {
  let btn = document.querySelector(".startbutton");
  btn.addEventListener("click", data.checkStatus(), false);
}
