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

let music = new Downloader();
music.getFiles(['https://psv4.vk.me/c613129/u156351840/audios/27f10b855687.mp3?extra=J7MzRDFDcVFvslkcncOdqYZdj0JSwoONHSc_Y_Zv7UTMzDN2fE7qjAC3aYwLi23cvQJLEwGBpeG0pHdF46GpSukFe8HL2eKfgHsxGjAhw5FTh96de5qxsHezRjiWTXD8jXir0P8mmqudnw']);

VK.Api.call('users.get', {user_ids: 6492}, function(r) {
  if(r.response) {
    alert('Привет, ' + r.response[0].first_name);
  }
});
