from flask import request

def get_pagination(default_limit=50, max_limit=200):
    try:
        limit = int(request.args.get("limit", default_limit))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        limit, offset = default_limit, 0
    limit = max(1, min(limit, max_limit))
    offset = max(0, offset)
    return limit, offset
