import React, { Component } from 'react';
import { Container, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            contentRes: ""
        };
    }

    componentDidMount() {
        axios.get(`https://public-api.wordpress.com/rest/v1/sites/truecaller.blog/posts/${this.props.match.params.id}`)
            .then((res) => {
                console.log('byeee 111', res);
                this.setState({
                    posts: res.data
                })
                let contentData = this.state.posts.content.replace(/(<([^>]+)>)/gi, "")
                this.setState({ contentRes: contentData })
            })
            .catch((err) => {
                console.log('The error is ', err);
            })
        //let test = this.state.posts.content.replace(/(<([^>]+)>)/gi, "");
    }

    render() {
        return (
            <>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active >
                        Post Details
                </Breadcrumb.Item>
                </Breadcrumb>
                <Container>
                    {this.state.contentRes}
                </Container>

            </>
        )
    }
}

export default PostDetail;