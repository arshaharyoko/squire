db = db.getSiblingDB("squire")

servers = db.createCollection("servers")
server_categories = db.createCollection("server_categories")
server_channels = db.createCollection("server_channels")
server_messages = db.createCollection("server_messages")

users = db.createCollection("users")

gfs_chunks = db.createCollection("gfs_chunks")
gfs_files = db.createCollection("gfs_files")