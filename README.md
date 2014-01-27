lottery-nba
===========

基于express框架和mongodb的篮彩系统。

#主要功能有：

	1.从虎扑抓取以往比赛结果等数据，存储在db中。

	2.按照多种方式查看以往数据，为下次投彩提供推断依赖。
	
	3.投彩时即时显示两队各自数据，交手数据，主客场数据。（TODO）
	
##使用方法

首先我确定你已经安装了nodejs和mongodb。

然后：

1.执行`npm install`来安装依赖的包。

2.执行`node app`在`localhost:3000`来运行程序

3.先访问`http://localhost:3000/getdata`来获取虎扑最近50天的NBA比赛数据并且存储到mongodb，根据网络情况会花费一些时间。

4.待存储完成之后,访问`http://localhost:3000/checkdata`来根据筛选条件来查看球队最近50天的比赛结果。
