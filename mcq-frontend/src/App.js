import React, {Component} from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import HomePage from './components/home/HomePage'
import AdminPage from './components/admin/dashboard/DashBoard';
import NotFound from './NotFound'
import LoginScreen from './components/users/auth/LoginScreen';
import RegisterScreen from './components/users/auth/RegisterScreen';
import ExamDetail from "./components/users/exam/list/doExamPage/ExamDetail";
import DisplayResult from "./components/users/exam/list/doExamPage/DisplayResult";
import Statistic from "./components/admin/exam/Statistic";
import UserProfile from "./components/users/profile/UserProfile";
import ExamDid from "./components/users/profile/ExamDid";
import ForgotPassword from './components/users/auth/ForgotPassword'
import ExamLectureBySubject from "./components/users/exam/list/examPage/ExamLectureBySubject";
import DisplayTest from "./components/users/exam/list/doExamPage/DisplayTest";
import ChapterComponent from "./components/users/exam/list/components/ChapterComponent";

class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path={'/forgot'}>
                        <ForgotPassword/>
                    </Route>
                    <Route exact path="/profile">
                        <UserProfile/>
                    </Route>
                    <Route exact path={'/history'}>
                        <ExamDid/>
                    </Route>
                    <Route path="/admin">
                        <AdminPage/>
                    </Route>
                    <Route exact path="/login">
                        <LoginScreen/>
                    </Route>
                    <Route exact path="/register">
                        <RegisterScreen/>
                    </Route>
                    <Route exact path={"/exam/do/:id"}>
                        <DisplayTest/>
                    </Route>
                    <Route exact path={"/exam/view/:id"}>
                        <ExamDetail/>
                    </Route>
                    <Route exact path={"/subject/:id"}>
                        <ChapterComponent/>
                    </Route>
                    <Route exact path={"/result/:id"}>
                        <DisplayResult/>
                    </Route>
                    <Route exact path={"/statistics/:id"}>
                        <Statistic/>
                    </Route>
                    <Route path="/" exact>
                        <HomePage/>
                    </Route>
                    <Route path="/404" component={NotFound}/>
                    <Redirect to="/404"/>
                </Switch>
            </Router>
        )
    }
}


export default App
