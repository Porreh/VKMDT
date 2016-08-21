class Downloader {
  saveFile(url, artist, title) {
    let filename = `${artist} - ${title}.mp3`;
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

  getFiles(dataArray) {
    for(let obj of dataArray) {
      this.saveFile(obj.url, obj.artist, obj.title);
    }
  }
}

class VKI {
  constructor() {
    this.id;
  }
  
  setID(newID) {
    this.id = newID;
  }

  getAudioData(ID) {
    let audioData = [];
    let id = (ID) ? ID : this.id;
    
    function getData(id) {
      VK.Api.call('audio.get', {owner_id: id}, function(x) { // CHANGE ID TO VARIABLE
        for(let i = 1; i < x.response.length - 1; i++) {
          let url = x.response[i].url,
              artist = x.response[i].artist,
              title = x.response[i].title;
          audioData.push({'url': url, 'artist': artist, 'title': title});
        }
      });
    }
    
    getData(id);
    return audioData;
  }

  logIn(response, self) {
    if(response.status == ('not_authorized' || 'unknown')) {
      VK.Auth.login(x => console.log(x), 8);
      console.info('LOGIN');
    } else {
      console.info('CONNECTED');
      console.log(response.session.mid);
      self.setID(response.session.mid); // NEED SOME WORK
    }
  }

  logOut() {
    VK.Auth.logout(x => console.log(x));
    console.info('LOGOUT');
  }

  getLoginStatus() {
    let self = this;
    VK.Auth.getLoginStatus(this.logIn, self);
  }
}

let vk = new VKI();
let downloader = new Downloader();

//let musicData = vk.getAudioData();

//let btn = document.querySelector(".startbutton");
//if(btn) {
//  btn.addEventListener("click", downloader.getFiles());
//}
