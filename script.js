document.addEventListener('DOMContentLoaded', function() {
    const repoOwner = 'thewaythetruth';
    const repoName = 'thewaythetruth.github.io';
    const customDomain = 'thewaythetruth.me';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const htmlFiles = data.filter(file => {
                return file.type === 'file' && file.name.endsWith('.html') && file.name !== 'index.html';
            });

            const fetchTitlePromises = htmlFiles.map(file => {
                const fileUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${file.name}`;
                return fetch(fileUrl)
                    .then(response => response.text())
                    .then(html => {
                        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                        const title = titleMatch ? titleMatch[1] : file.name.replace('.html', '');
                        return {
                            url: `https://${customDomain}/${file.name.replace('.html', '')}`,
                            title: title.trim()
                        };
                    });
            });

            Promise.all(fetchTitlePromises)
                .then(links => {
                    const linkList = document.getElementById('linkList');
                    links.forEach(link => {
                        const listItem = document.createElement('li');
                        const linkElement = document.createElement('a');
                        linkElement.href = link.url;
                        linkElement.textContent = link.title;
                        listItem.appendChild(linkElement);
                        linkList.appendChild(listItem);
                    });
                })
                .catch(error => {
                    console.error('Error fetching titles:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching GitHub repository:', error);
        });
});