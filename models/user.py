# pending, accepted & rejected proposals for user
def get_all_user_proposals(user_id):
    return mongo.proposals.find({'user': user_id})
