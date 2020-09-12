import React from 'react';
import { Row, Col, Container, Card, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link} from "react-router-dom";
//import ShowMoreText from 'react-show-more-text';

class PostDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      offset: 0,
      perPage: 4,
      currentPage: 0,
      postData: [],
    };
    this.handlePageClick = this
      .handlePageClick
      .bind(this);
  }
  
  displayCutString(s, n){
    var cut= s.indexOf(' ', n);
    if(cut=== -1) return s;
    return s.substring(0, cut)

  }

  time_ago(time) {

    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;
  
    if (seconds === 0) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    return time;
  }
  
 /* postedDate = Date.parse('2020-09-07T14:37:29+02:00');
  console.log(time_ago(new Date(Date.parse('2020-09-07T14:37:29+02:00'))));
 */
  removeSpecialChar(data) {
    data.replace(/(<([^>]+)>)/gi, "");
  }
  receivedData() {
    axios
      .get(`https://public-api.wordpress.com/rest/v1/sites/truecaller.blog/posts`)
      .then(res => {
        const data = res.data.posts;    
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

        const postData = slice.map(pd => <React.Fragment>
          <div class="col-md-6 col-lg-4">
            <Col className="card-deck"><Card style={{ width: '30rem', height: '35 rem' }}>
              <Card.Img variant="top" src={pd.featured_image} className="card-picture"  />
              <Card.Body>
                <Card.Title>
                  {pd.title}              
                  </Card.Title>
                <Card.Text >
                  { this.displayCutString(pd.content,150)}                
               <span className = "readmore"> <Link to={`/post-detail/${pd.ID}`}>.... Read More</Link>
               </span> 
                </Card.Text >
                <span className= "date-text"> <strong>{this.time_ago(new Date(Date.parse(pd.date)))}</strong></span>
                     
               {/*  <Button variant="primary">Click here</Button> */}
              </Card.Body>
            </Card></Col>
          </div>
        </React.Fragment>)
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          postData
        })
      });
  }
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
      currentPage: selectedPage,
      offset: offset
    }, () => {
      this.receivedData()
    });

  };

  componentDidMount() {
    this.receivedData()
  }
  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        </Breadcrumb>

        <Container fluid="md">
          <Row>{this.state.postData}
           </Row>
          <Row>
            {this.state.postData.length > 0 ? (
              <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />

            ) : null
            }

          </Row>
        </Container>
      </div>
    )
  }

}
export default PostDisplay;