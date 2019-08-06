import React, {Component} from 'react';
import LazyLoad from 'react-lazy-load';
import { MoviesData } from '../fixture/completeMoviesData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faThumbsUp, faThumbsDown, faPlayCircle, faCalendar, faQuestion } from '@fortawesome/free-solid-svg-icons'

const FetchStatus = {
    LOADING: 'LOADING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
}

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: FetchStatus.LOADING,
            trailerColumns: 5,
            completeMoviesData: [],
            showTrailerData: {},
            isShowTrailer: false,
        };
    }

    componentWillMount() {
        this.getcompleteMoviesData();
    }

    getcompleteMoviesData() {
        let url = "https://in.bookmyshow.com/serv/getData?cmd=GETTRAILERS&mtype=cs";

        fetch(url).then((response) => {
            return response.text();
        }).then((data) => {
            let completeMoviesData = JSON.parse(data); // TODO: FIX for cors issue
            this.setState({
                completeMoviesData,
                currentState: FetchStatus.COMPLETED,
            });
        }).catch((error) => {
            this.setState({
                completeMoviesData: MoviesData,
                currentState: FetchStatus.FAILED,
            });
            console.log(this.state);
        });
    }

    renderTrailerData() {
        let showTrailerData = this.state.showTrailerData;
        let imageURL = "https://in.bmscdn.com/events/moviecard/" + showTrailerData.movieData.EventCode + ".jpg";
        let trailerURL = showTrailerData.movieData.TrailerURL;
        trailerURL = trailerURL.split('/');
        trailerURL[3] = trailerURL[3].split('=')[1];
        trailerURL.splice(3, 0, "embed");
        trailerURL = trailerURL.join('/');
        
        let movieGenre = [];
        showTrailerData.movieData.EventGenre.split('|').forEach(_ => {
            movieGenre.push(<div key={_} className='tag'>{_}</div>);
        });
        return (
            <div key={showTrailerData.movieData.EventCode} className='row'>
                <div className='trailer-wrapper' style={{width: this.state.trailerColumns * 250}}>
                    <div className='trailer'>
                        <iframe title={showTrailerData.movieData.EventCode} style={{width: '100%', height: 500, borderRadius: "10px 0 0 10px", verticalAlign: 'bottom', border: 0}}
                            src={trailerURL + "?autoplay=1"}
                        />
                    </div>
                    <div className='movie-details'>
                        <div className='movie-title'>{showTrailerData.movieData.EventName}</div>
                        <div className='language'>{showTrailerData.movieData.EventLanguage}</div>
                        <div className='movie-info'>
                            <div>
                                <FontAwesomeIcon icon={faThumbsUp} />
                            </div>
                            <div>
                                {`${showTrailerData.movieData.wtsPerc} %`} <br />
                                <small>{`${showTrailerData.movieData.wtsCount} Votes`}</ small>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faCalendar} />
                            </div>
                            <div>
                                {showTrailerData.movieData.ShowDate.split(', ')[0]} <br />
                                <small>{showTrailerData.movieData.ShowDate.split(', ')[1]}</small>
                            </div>
                        </div>
                        {movieGenre}
                        <div className='user-review'>
                            <div className='will-watch'>
                                <FontAwesomeIcon icon={faThumbsUp} />
                                WILL WATCH
                            </div>
                            <div className='maybe-watch'>
                                <FontAwesomeIcon icon={faQuestion} />
                                MAY BE
                            </div>
                            <div className='wont-watch'>
                                <FontAwesomeIcon icon={faThumbsDown} />
                                WON'T WATCH
                            </div>
                        </div>
                        <div className='trailer-img' style={{backgroundImage: `url(${imageURL})`}}></div>
                        <div className='close'
                            onClick={() => this.closeTrailer()}>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    openTrailer(rowNumber, movieData) {
        this.setState({
            isShowTrailer: true,
            showTrailerData: {
                rowNumber,
                movieData,
            },
        })
    }

    closeTrailer() {
        this.setState({
            isShowTrailer: false,
            showTrailerData: {},
        })
    }

    renderMovie(rowNumber, columnNumber, trailerColumns, listOfMovieIds) {
        let eventId = listOfMovieIds[rowNumber * trailerColumns + columnNumber];
        let movieData = this.state.completeMoviesData[1][eventId];
        return (
            <div key={eventId} className='movie-wrapper'
                onClick={() => this.openTrailer(rowNumber, movieData)}>
                <div>
                    <LazyLoad>
                        <img alt={eventId} src={`https://in.bmscdn.com/events/moviecard/${eventId}.jpg`}/>
                    </LazyLoad>
                    <div className='date-wrapper'>
                        {movieData.ShowDate.split(', ')[0].split(' ')[1]} <br />
                        {movieData.ShowDate.split(', ')[1]}
                    </div>
                    <div className='upvote-info'>
                        <div>
                            <FontAwesomeIcon icon={faThumbsUp} />
                            {movieData.wtsPerc + ' %'}
                        </div>
                        <div>
                            <small>{`${movieData.wtsCount} Votes`}</small>
                        </div>
                    </div>
                    <div className='play-icon'>
                        <FontAwesomeIcon icon={faPlayCircle} />
                    </div>
                </div>
                    {movieData['EventName']}
            </div>
        );
    }

    renderTrailer(rowNumber, trailerColumns, listOfMovieIds) {
        let rowData = [];
        for (let i = 0; i < trailerColumns; i++) {
            rowData.push(this.renderMovie(rowNumber, i, trailerColumns, listOfMovieIds))
        }
        return (
            <div key={rowNumber} className='row'>
                {rowData}
            </div>
        );
    }

    render() {
        if (this.state.currentState === FetchStatus.LOADING) {
            return (
                <div className='loading'>
                    Loading
                </div>
            );
        }

        let listOfMovieIds = Object.keys(this.state.completeMoviesData[1]);
        let trailerColumns = this.state.trailerColumns;
        let numberOfRows = Math.floor(listOfMovieIds.length / trailerColumns);
        let moviesData = [];
        for (let i = 0; i < numberOfRows; i++) {
            if (this.state.isShowTrailer && this.state.showTrailerData.rowNumber === i) {
                let trailerData = this.renderTrailerData();
                moviesData.push(trailerData);
            }
            moviesData.push(this.renderTrailer(i, trailerColumns, listOfMovieIds))
        }

        return (
            <div className='body'>
                <LazyLoad>
                    <div>
                        {moviesData}
                    </div>
                </LazyLoad>
            </div>
        );
    }
}

export default Body;
