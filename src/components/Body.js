import React, {Component} from 'react';
import LazyLoad from 'react-lazy-load';
import { MoviesData } from '../fixture/completeMoviesData';

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
        let trailerColumns = this.state.trailerColumns;
        let showTrailerData = this.state.showTrailerData;
        let imageURL = "https://in.bmscdn.com/events/moviecard/" + showTrailerData.movieData.EventCode + ".jpg";
        let trailerURL = showTrailerData.movieData.TrailerURL;
        trailerURL = trailerURL.split('/');
        trailerURL[3] = trailerURL[3].split('=')[1];
        trailerURL.splice(3, 0, "embed");
        trailerURL = trailerURL.join('/');
        return (
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', width: trailerColumns * 250, marginBottom: 15}}>
                    <div style={{width: "60%", marginLeft: 10, borderRadius: "10px 0 0 10px"}}>
                        <iframe title={showTrailerData.movieData.EventCode} style={{width: '100%', height: 500, borderRadius: "10px 0 0 10px", verticalAlign: 'bottom', border: 0}}
                            src={trailerURL + "?autoplay=1"}
                        />
                    </div>
                    <div style={{width: "40%", marginRight: 9, borderRadius: "0 10px 10px 0", textAlign: 'left', padding: 10, position: 'relative'}}>
                            {showTrailerData.movieData.EventDimension}
                            {showTrailerData.movieData.EventName}
                            {showTrailerData.movieData.DispReleaseDate}
                        <div style={{display: 'flex', alignItems: 'center'}}>
                                {showTrailerData.movieData.wtsPerc + ' % | ' + showTrailerData.movieData.wtsCount + " Votes"}
                        </div>
                            {showTrailerData.movieData.EventGenre.split('|')[0]}
                            {showTrailerData.movieData.EventLanguage}
                        <div style={{display: 'flex', padding: "0.5%", textAlign: 'center', position: 'absolute', width: "100%", right: 0, bottom: 10}}>
                            <div style={{width: '33%'}}>
                                    WILL WATCH
                            </div>
                            <div style={{width: '33%'}}>
                                    MAY BE
                            </div>
                            <div style={{width: '33%'}}>
                                    WON'T WATCH
                            </div>
                        </div>
                        <div style={{backgroundImage: `url(${imageURL})`, position: 'absolute', top: 0, right: 0, height: "100%", width: "100%", opacity: 0.1, backgroundSize: "cover", borderRadius: "0 10px 10px 0"}}></div>
                        <div style={{cursor: 'pointer', position: 'absolute', top: 10, right: 10}}
                             onClick={() => this.closeTrailer()}>
                            close
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
            <div key={eventId} style={{width: 232, margin: "0 9px 15px 9px", borderRadius: 10, cursor: 'pointer'}}
                 onClick={() => this.openTrailer(rowNumber, movieData)}>
                <div style={{position: 'relative'}}>
                    <LazyLoad width={232} height={300}>
                        <img alt={eventId} src={"https://in.bmscdn.com/events/moviecard/" + eventId + ".jpg"} style={{borderRadius: "10px 10px 0 0"}}/>
                    </LazyLoad>
                    
                    <div style={{position: 'absolute', top: 0, left: 0, borderRadius: "10px 10px 0 0", margin: 10}}>
                            {movieData.EventDimension}
                    </div>
                    <div style={{position: 'absolute', top: 0, right: 0, borderRadius: "10px 10px 0 0", margin: 10}}>
                        <div style={{padding: 10, width: 42, borderRadius: 62}}>
                                {movieData.ShowDate.split(', ')[0].split(' ')[1]}
                                {movieData.ShowDate.split(', ')[1]}
                        </div>
                    </div>
                    <div style={{position: 'absolute', bottom: 0, right: 0, borderRadius: "10px 10px 0 0", margin: 10, textAlign: 'right'}}>
                            {movieData.EventGenre.split('|')[0]}
                            {movieData.EventLanguage}
                    </div>
                    <div style={{position: 'absolute', bottom: 0, left: 0, borderRadius: "10px 10px 0 0", padding: 10}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                                {movieData.wtsPerc + ' %'}
                        </div>
                        <div>
                                {movieData.wtsCount + " Votes"}
                        </div>
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
            <div key={rowNumber} style={{display: 'flex'}}>
                {rowData}
            </div>
        );
    }

    render() {
        if (this.state.currentState === FetchStatus.LOADING) {
            return (
                <div style={{textAlign: 'center'}}>
                    Loading
                </div>
            );
        }

        let listOfMovieIds = Object.keys(this.state.completeMoviesData[1]);
        let trailerColumns = this.state.trailerColumns;
        let numberOfRows = Math.floor(listOfMovieIds.length / trailerColumns);
        let moviesData = [];
        console.log(numberOfRows, listOfMovieIds.length);
        for (let i = 0; i < numberOfRows; i++) {
            if (this.state.isShowTrailer && this.state.showTrailerData.rowNumber === i) {
                let trailerData = this.renderTrailerData();
                moviesData.push(trailerData);
            }
            moviesData.push(this.renderTrailer(i, trailerColumns, listOfMovieIds))
        }

        return (
            <div>
                <LazyLoad>
                    <div style={{paddingTop: 15}}>
                        {moviesData}
                    </div>
                </LazyLoad>
            </div>
        );
    }
}
export default Body;