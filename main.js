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
  
  setUserID() {
    let response = VK.Auth.getSession(x => x);
    this.setID(response.mid);
    console.log(`USER ID - ${this.id}`);
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
    let status = VK.Auth.getLoginStatus(x => x.status);
    if(status !== 'connected') {
      if(self.logIn() == 'connected') {
        self.setUserID();
      }
    } else {
      self.setUserID();
    }
    
    // VK.Auth.getLoginStatus(function(response) {
    //   if(response.status !== 'connected') {
    //     if(self.logIn() == 'connected') {
    //       console.log(2);
    //       //self.setUserID();
    //     }
    //   } else {
    //     console.log(CNCTD);
    //   }
    // });
    
    // VK.Auth.getLoginStatus(function(response) {
    //   if (response.session) {
    //     console.log(1);
    //     //self.setUserID();
    //   } else {
    //     if(self.logIn() == 'connected') {
    //       console.log(2);
    //       //self.setUserID();
    //     }
    //     console.log(3);
    //     //self.setUserID();
    //   }
    // });
  }
}

let vk = new VKI();
let downloader = new Downloader();

//let musicData = vk.getAudioData();

//let btn = document.querySelector(".startbutton");
//if(btn) {
//  btn.addEventListener("click", downloader.getFiles());
//}
