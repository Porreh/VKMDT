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
    console.log(`USER ID - ${this.id}`);
  }

  getAllAudioData(ID) {
    let audioData = [];
    let id = (ID) ? ID : this.id;
    VK.Api.call('audio.get', {owner_id: id}, function(x) {
      for(let i = 1; i < x.response.length; i++) {
        let url = x.response[i].url,
            artist = x.response[i].artist,
            title = x.response[i].title;
        audioData.push({'url': url, 'artist': artist, 'title': title});
      }
    });
    return audioData;
  }

  logIn() {
    console.info('LOGIN');
    return VK.Auth.login(x => x.status, 8);
  }

  logOut() {
    VK.Auth.logout(x => console.log(x));
    console.info('LOGOUT');
  }

  getLoginStatus() {
    let self = this;
    let status;
    let id;
    function saveData(response) {
      status = response.status;
      if (response.session) {
        id = response.session.mid;
      }
    }
    VK.Auth.getLoginStatus(saveData);
    
    console.log(status);
    
    if(status !== 'connected') {
      console.log(`not connected`);
      if(self.logIn() == 'connected') {
        self.setID(session.mid);
      }
    } else {
      console.log(`connected`);
      self.setID(session.mid);
    }
  }
}

let vk = new VKI();
let downloader = new Downloader();

//let musicData = vk.getAudioData();

//let btn = document.querySelector(".startbutton");
//if(btn) {
//  btn.addEventListener("click", downloader.getFiles());
//}
