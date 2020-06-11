// Selecting new guild
let guildSelect = (g, img) => {
    // Update the selected guild
    //document.getElementById('guildIndicator').style.display = 'block';
    if (oldimg)
        oldimg.classList.remove('selectedGuild');
    img.classList.add('selectedGuild');

    // this should be done another way
    document.getElementById('guildIndicator').style.marginTop = `${img.offsetTop - 2}px`;
    document.getElementById('guildIndicator').style.display = "block";

    oldimg = img;

    // Clear the message loop interval
    try {
        clearInterval(memberLoop);
    } catch(err){}

    // Update the member count every 2000 ms
    global.memberLoop = setInterval(() => {
        document.getElementById('members-count').innerText = g.memberCount;
    }, 2000);
    // Set the count to begin
    document.getElementById('members-count').innerText = g.memberCount;

    // Clear the channels list
    let channelList = document.getElementById("channel-elements");
    while (channelList.firstChild)
        channelList.removeChild(channelList.firstChild);

    // Update guild profile name
    let name = g.name;
    if (g.name.length <= 22)
        name = name.substring(0, 19)+'...';
    document.getElementById('guildName').innerHTML = name;

    // Update guild profile image
    let icon = g.iconURL;
    if (!icon) {
        icon = 'resources/images/default.png';
    }
    document.getElementById('guildImg').src = icon;

    // Create the member list
    addMemberList(g);

    // The parent variable will change, realParent will not
    const realParent = document.getElementById("channel-elements");
    let parent = realParent;
    let categoryParent;

    // Sort the channels and add them to the screen
    g.channels.array()
        .filter(c => c.type == 'category')
        .sort((c1, c2) => c1.position - c2.position)
        .forEach(c => {

            if (c.type == 'category') {
                let category = document.createElement('div');
                category.classList.add("category");
                category.id = c.id;
				//Add the images
				let svg = document.createElement('img');
                svg.src = `./resources/icons/categoryArrow.svg`;
				svg.classList.add("channelSVG");
				category.appendChild(svg);
				
				realParent.appendChild(category);
				
                // Set the parent for the next added channels
                parent = category;
                categoryParent = c;

                let text = document.createElement("h5");
                text.classList.add("categoryText");
                text.innerText = c.name;
                category.appendChild(text);
				
				category.addEventListener("click", function() {
						for(i = 0;i<category.children.length;i++){
						var content = category.children[i];
							if(content.classList.contains("channel")){
								console.log(content);
									if (content.style.display === "block") {
									  content.style.display = "none";
									} else {
									  content.style.display = "block";
									}
							}
						}
			  });
            }
        });

    g.channels.array()
        .filter(c => c.type != 'category')
        .sort((c1, c2) => c1.position - c2.position)
        .forEach(c => {
            // At this point, the channel is either text or voice
            let div = document.createElement("div");
            div.classList.add("channel");
            div.classList.add(c.type);
            div.id = c.id;
			div.style.display === "block"

            // check if user can access the channel
            let blocked = false;
            if (!c.permissionsFor(g.me).has("VIEW_CHANNEL")) {
                blocked = true;
                div.classList.add("blocked");
            }

            // Create the svg icon
            let svg = document.createElement('img');
            // svg.type = "image/svg+xml";
            // svg.data
            svg.src = `./resources/icons/${c.type}Channel${blocked ? 'Blocked' : ''}.svg`;
            svg.classList.add("channelSVG");
            div.appendChild(svg);

            // Add the text
            let channelName = document.createElement('h5');
            channelName.classList.add('viewableText');
            channelName.innerText = c.name;
            div.appendChild(channelName);
            // Finally, add it to the parent
            if (c.parentID)
                document.getElementById(c.parentID).appendChild(div);
            else
                realParent.insertBefore(div, realParent.querySelector('.category'));


            if (!blocked) {
                div.addEventListener("click", event => {
                    let previous = realParent.querySelector('.selectedChan');
                    let id;
                    if (previous) {
                        id = previous.id;
                        if (id != c.id)
                            previous.classList.remove("selectedChan");
                    }

                    if (id != c.id) {
                        div.classList.add("selectedChan");
                        channelSelect(c, div);
                    }
                });
            }
        });
}