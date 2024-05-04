document.getElementById('convertButton').addEventListener('click', async () => {
    const playlistUrl = document.getElementById('playlistUrl').value;
    const response = await fetch(`https://your-lambda-function-url.com?playlistUrl=${playlistUrl}`);
    const songs = await response.json();

    document.getElementById('songsTitle').style.display = 'block';
    document.getElementById('songs').innerHTML = songs.map(song => `<p>${song}</p>`).join('');
});
