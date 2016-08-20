class Downloader {
  constructor(linkList) {
    this.linkList = linkList;
  }

  saveFile(url, artist, title) {
    let filename;
    if((artist && title) == 'undefined') {
      filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
    } else {
      filename = `${artist} - ${title}.mp3`;
    }
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
    for(let obj of (this.linkList || linkList)) {
      console.log(obj.url);
    }
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

  getMusicData() {
    let musicData = [];
    VK.Api.call('audio.get', {owner_id: 137768020}, function(x) { // Chenge ID
      for(let i = 1; i < x.response[0]; i++) {
        let url = x.response[i].url,
            artist = x.response[i].artist,
            title = x.response[i].title;
        musicData.push({'artist': artist, 'title': title, 'url': 'https://crossorigin.me/' + url});
      }
    });
    return musicData;
  }

  logIn(response) {
    if(response.status == ('not_authorized' || 'unknown')) {
      VK.Auth.login(this.logIn, 8);
    } else {
      console.log('already connected');
      this.uID = response.session.mid;
      console.log(response.session.mid);
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

let vk = new VKI();
let musicData = vk.getMusicData();
let downloader = new Downloader(musicData);
let btn = document.querySelector(".startbutton");
btn.addEventListener("click", downloader.getFiles());
