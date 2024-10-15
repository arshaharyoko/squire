import { writable } from "svelte/store";
import req from "axios";

export var auth = writable(false);
export var user = writable({});

export var group = writable({});
export var groupCategories = writable([]);
export var groupChannels = writable([]);
export var groupMessages = writable([]);
export var groupList = writable([]);

export var selectedCategory = writable();

export var displayStatus = writable(false);
export var panelInstance = writable();

export async function refreshAuth() {
    auth.set((await req.post("/api/user?status")).data);
}

//=================================
// API Functions:
// - Fetch generic data, such as images, user data (name, email, servers)
//=================================
async function fetchUser() {
    user.set((await req.post("/api/user")).data);
}

async function fetchGroups() {
    groupList.set((await req.post("/api/groups")).data);
}

async function fetchChannels(group_id, category_id) {
    return (await req.post(`/group/${group_id}?channels=${category_id}`)).data;
}

//=================================
// initGroup:
// - Fetch initial data, such as categories, channels, and users
// - Initialize WebSocket connection
//=================================
export async function initGroup(id) {
    group.set((await req.post(`/group/${id}`)).data);
    var categories = (await req.post(`/group/${id}?categories`)).data;
    var categoryChannels = [];
    for(var i=0;i<categories.length;i++) {
        var channels = (await fetchChannels(id, categories[i]._id));
        channels.forEach(o=>{
            categoryChannels.push(o);
        });
    }

    groupCategories.set(categories);
    groupChannels.set(categoryChannels);
}

export async function initChannel(group_id, channel_id) {
    groupMessages.set((await req.post(`/group/${group_id}/${channel_id}`)).data);
}

export async function getProps() {
    await fetchUser();
    await fetchGroups();
}