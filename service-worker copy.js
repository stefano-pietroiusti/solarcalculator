self.addEventListener('message', event => {
  let data = JSON.parse(event.data);
  if (data.action === 'getRectangleArea') {
    let length = data.length;
    let width = data.width;
    getRectangleArea(length, width).then(area => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({area: area});
        });
      });
    });
  }
});

async function getRectangleArea(length, width) {
  return length * width;
}
