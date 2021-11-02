# Front of TreatmentTree

##Install

```
yarn install
```

##Start

```
yarn start
```

##Description

###Backend Connection

This project will automatically connect to 5000 port of localhost.

*Can be changed in src/store/Fetcher.js*

```javascript
const url = 'http://127.0.0.1:5000'
```

###Filter View

<img width="30%" src="./assets/filterview.png"/>

Click on the check to confirm the filter conditions and get some sequences which suggested by backend randomly.

Click the refresh button to get some new sequences. 

###Main View

<img width="100%" src="./assets/mainview.png"/>

Click on a green or red square to explore it in detail view.

Click on an action where the indices of Vasopressor and Intravenous are to show other similar policy in sequence view.

*TODO: fix the real record in the top of the view to make comparison easier.* 

###Detail View

<img width="60%" src="./assets/detailview.png"/>

Click on an action to show other outcomes after different treatment policy.

###Sequence View

<img width="50%" src="./assets/sequenceview.png"/>

Open or close front button, middle button, and rear button to filter the sequences below by its position appeared in the sequence.

Click the left or right arrow to align the events at different occurs.