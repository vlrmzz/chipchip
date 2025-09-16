import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Tweet, TweetCreate, TweetPublic, TweetsPublic, TweetUpdate, Message, User

router = APIRouter(prefix="/tweets", tags=["tweets"])


@router.get("/", response_model=TweetsPublic)
def read_tweets(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve all tweets (public timeline).
    """
    count_statement = select(func.count()).select_from(Tweet)
    count = session.exec(count_statement).one()

    statement = (
        select(Tweet)
        .order_by(Tweet.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    tweets = session.exec(statement).all()

    # Load author information for each tweet
    tweet_data = []
    for tweet in tweets:
        author = session.get(User, tweet.author_id)
        tweet_public = TweetPublic.model_validate(tweet)
        if author:
            from app.models import UserPublic
            tweet_public.author = UserPublic.model_validate(author)
        tweet_data.append(tweet_public)

    return TweetsPublic(data=tweet_data, count=count)


@router.get("/my", response_model=TweetsPublic)
def read_my_tweets(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve current user's tweets.
    """
    count_statement = (
        select(func.count())
        .select_from(Tweet)
        .where(Tweet.author_id == current_user.id)
    )
    count = session.exec(count_statement).one()

    statement = (
        select(Tweet)
        .where(Tweet.author_id == current_user.id)
        .order_by(Tweet.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    tweets = session.exec(statement).all()

    return TweetsPublic(data=tweets, count=count)


@router.get("/{id}", response_model=TweetPublic)
def read_tweet(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get tweet by ID.
    """
    tweet = session.get(Tweet, id)
    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")

    # Load author information
    author = session.get(User, tweet.author_id)
    tweet_public = TweetPublic.model_validate(tweet)
    if author:
        from app.models import UserPublic
        tweet_public.author = UserPublic.model_validate(author)

    return tweet_public


@router.post("/", response_model=TweetPublic)
def create_tweet(
    *, session: SessionDep, current_user: CurrentUser, tweet_in: TweetCreate
) -> Any:
    """
    Create new tweet.
    """
    tweet = Tweet.model_validate(tweet_in, update={"author_id": current_user.id})
    session.add(tweet)
    session.commit()
    session.refresh(tweet)
    return tweet


@router.put("/{id}", response_model=TweetPublic)
def update_tweet(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    tweet_in: TweetUpdate,
) -> Any:
    """
    Update a tweet.
    """
    tweet = session.get(Tweet, id)
    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")
    if tweet.author_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    update_dict = tweet_in.model_dump(exclude_unset=True)
    tweet.sqlmodel_update(update_dict)
    session.add(tweet)
    session.commit()
    session.refresh(tweet)
    return tweet


@router.delete("/{id}")
def delete_tweet(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete a tweet.
    """
    tweet = session.get(Tweet, id)
    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")
    if tweet.author_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    session.delete(tweet)
    session.commit()
    return Message(message="Tweet deleted successfully")