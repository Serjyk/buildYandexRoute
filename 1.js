ymaps.ready(initFour);

// Начальные значения 
var listNamePoints = [];


var multiRoute;
var myMap;

var listLiPoints = [];
// Объявляем набор опорных точек и массив индексов транзитных точек.
var referencePoints = [];
var viaIndexes = [];


//*************************************************
//  получить координаты точки после ее перемещения
/*
var myPlacemark = new ymaps.Placemark([55.76, 37.64], {
    hintContent: 'Содержимое всплывающей подсказки',
    balloonContent: 'Содержимое балуна'
  });
  
myPlacemark.events.add('dragend', function () {
            console.log(myPlacemark.geometry.getCoordinates());
        });
        */

// Установить иконку для точки со своим именем
 //points.get(0).properties.set('iconContent', 'Точка отправления');


//*********************************************


document.getElementById("butAddPoint").onclick = addPointOnList;
    
function addPointOnList(){
    var namePoint = document.getElementById("nameNewPointRoute").value;
    if(namePoint == "")
        return;
    
    var listPointForm = document.getElementById("listpoint");
   
    
    listNamePoints.push(namePoint);
    
    ////
    var li = document.createElement("li");
    li.value = listLiPoints.length;
    listLiPoints.push(li);
    var t = document.createTextNode(namePoint);
    
    
    li.appendChild(t);
    if(namePoint == "")
        {
            
        }
    else
        {
            document.getElementById("listpointui").appendChild(li);
        }
    
    addPointOnMap();
    
    document.getElementById("nameNewPointRoute").value = "";
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("X");
    span.className = "closePoint";
    span.appendChild(txt);
    span.onclick = function(ev){
        var lip = ev.target.parentNode;
        var valueLi = lip.value;
        
        lip.remove();
        removePoint(valueLi);
    }
    
    
    li.appendChild(span);
}


function addPointOnMap()
{
    referencePoints.push(myMap.getCenter());
     
     
    multiRoute.model.setReferencePoints(referencePoints, viaIndexes);

    var startPoint = multiRoute.getWayPoints().get(0);    
}

function removePoint(valueLi)
{
    var referencePointsTemp = [];
    for(var i = 0; i < referencePoints.length; i++)
        {
            if(i != valueLi)
               {
               referencePointsTemp.push(referencePoints[i]);
               }
        }
    referencePoints = referencePointsTemp;
    
    //console.log(valueLi);
    // Объявляем обработчики для кнопок.
    listLiPoints.splice(valueLi, 1);
    for(var i = valueLi; i < listLiPoints.length; i++)
        {
            listLiPoints[i].value = i;
        }
    
    multiRoute.model.setReferencePoints(referencePoints);
    
    listNamePoints.splice(valueLi, 1);

}





function initFour() {
    

    // Создаем мультимаршрут и настраиваем его внешний вид с помощью опций.
    multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: referencePoints,
        params: {
        // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
        results: 1
        }
        /*,
        params: {viaIndexes: viaIndexes}*/
    }, {
        // Внешний вид путевых точек.
        //***wayPointStartIconColor: "#333",
        //***wayPointStartIconFillColor: "#B3B3B3",
        // Задаем собственную картинку для последней путевой точки.
        //**wayPointFinishIconLayout: "default#image",
        //**wayPointFinishIconImageHref: "images/sokolniki.png",
        //**wayPointFinishIconImageSize: [30, 30],
        //**wayPointFinishIconImageOffset: [-15, -15],
        // Позволяет скрыть иконки путевых точек маршрута.
        // wayPointVisible:false,

        // Внешний вид транзитных точек.
        //***viaPointIconRadius: 7,
        //***viaPointIconFillColor: "#000088",
        //***viaPointActiveIconFillColor: "#E63E92",
        // Транзитные точки можно перетаскивать, при этом
        // маршрут будет перестраиваться.
        viaPointDraggable: true,
        // Позволяет скрыть иконки транзитных точек маршрута.
        // viaPointVisible:false,

        // Внешний вид точечных маркеров под путевыми точками.
        //***pinIconFillColor: "#000088",
       //*** pinActiveIconFillColor: "#B3B3B3",
        // Позволяет скрыть точечные маркеры путевых точек.
        // pinVisible:false,

        // Внешний вид линии маршрута.
        //***routeStrokeWidth: 2,
        //***routeStrokeColor: "#000088",
        //***routeActiveStrokeWidth: 6,
        //***routeActiveStrokeColor: "#E63E92",

        // Внешний вид линии пешеходного маршрута.
        //***routeActivePedestrianSegmentStrokeStyle: "solid",
        //***routeActivePedestrianSegmentStrokeColor: "#00CDCD",

        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true,
        // Путевые точки можно перетаскивать.
        // Маршрут при этом будет перестраиваться.
        wayPointDraggable: true,
        mapStateAutoApply: true
    });
    
    
    multiRoute.model.events.add("requestsuccess", function(){
			
        var pointsWay = multiRoute.getWayPoints();
        
        for(var i = 0; i < pointsWay.getLength(); i++)
            {
                var point = multiRoute.getWayPoints().get(i);
                /*
                var MyWayPointLayout = ymaps.templateLayoutFactory.createClass('{{properties.iconContent}}');
                point.options.set('iconContentLayout', MyWayPointLayout);
                point.properties.set('iconContent', listNamePoints[i]); */ 
                
                // Создаем балун у метки второй точки.
                ymaps.geoObject.addon.balloon.get(point);
                point.options.set({
                    //preset: "islands#grayStretchyIcon",
                    iconContentLayout: ymaps.templateLayoutFactory.createClass(listNamePoints[i]),
                    balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                    listNamePoints[i])
                });
            }
            
                
        if(pointsWay.getLength() >= 2)
            {
                var pointStart = multiRoute.getWayPoints().get(0);
                var pointEnd = multiRoute.getWayPoints().get(pointsWay.getLength()-1);

                pointStart.options.set({
                    iconContentLayout: ymaps.templateLayoutFactory.createClass("Точка отправления")
                });
                pointEnd.options.set({
                    iconContentLayout: ymaps.templateLayoutFactory.createClass("Точка прибытия")
                });

            }
    });
    



    // Создаем карту с добавленной на нее кнопкой.
    myMap = new ymaps.Map('map', {
            center: [58.048454, 38.858406],
            zoom: 13,
            controls: []
        }, {
            buttonMaxWidth: 300
        });

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects.add(multiRoute);
    
    

}


// Отслеживание нажатия клавиши
document.getElementById("nameNewPointRoute").onkeypress = function(event)
{
    if(event.keyCode == 13)
        {
            addPointOnList();
        }
}


//*********************************************
// Тесты


var myroute;
function initTwo ()
{
    // Создаем кнопки.
    var removePointsButton = new ymaps.control.Button({
            data: {content: "Удалить промежуточные точки"},
            options: {selectOnClick: true}
        });

    // Объявляем обработчики для кнопок.
    removePointsButton.events.add('select', function () {
        multiRoute.model.setReferencePoints([
            referencePoints[0],
            referencePoints[referencePoints.length - 1]
        ], []);
    });

    removePointsButton.events.add('deselect', function () {
        referencePoints.push( 'Москва, улица Крылатские холмы');
        referencePoints.push( 'Москва, метро Молодежная');
        referencePoints.push( 'Москва, метро Пионерская');       
        
        multiRoute.model.setReferencePoints(referencePoints, viaIndexes);
        // Т.к. вторая точка была удалена, нужно заново ее настроить.
        //customizeSecondPoint();
    });
    
   // Создаем карту с добавленной на нее кнопкой.
    var myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 7,
        controls: [removePointsButton]
    }, {
        buttonMaxWidth: 300
    });


    ymaps.route([
        'Москва, улица Крылатские холмы',
        {
            point: 'Москва, метро Молодежная',
            // метро "Молодежная" - транзитная точка
            // (проезжать через эту точку, но не останавливаться в ней).
            type: 'viaPoint'
        },
        [55.731272, 37.447198], // метро "Кунцевская".
        'Москва, метро Пионерская'
    ]).then(function (route) {
        myroute = route;
        
        myMap.geoObjects.add(myroute);
        editStyle();
        // Зададим содержание иконок начальной и конечной точкам маршрута.
        // С помощью метода getWayPoints() получаем массив точек маршрута.
        // Массив транзитных точек маршрута можно получить с помощью метода getViaPoints.
        

    }, function (error) {
        alert('Возникла ошибка: ' + error.message);
    });  
}


function editStyle()
    {
        var points = myroute.getWayPoints(),
            lastPoint = points.getLength() - 1;
        // Задаем стиль метки - иконки будут красного цвета, и
        // их изображения будут растягиваться под контент.
        points.options.set('preset', 'islands#redStretchyIcon');
        // Задаем контент меток в начальной и конечной точках.
        points.get(0).properties.set('iconContent', 'Точка отправления');
        points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');
        
    }

    // Настраиваем внешний вид второй точки через прямой доступ к ней.
    //customizeSecondPoint();

    // Создаем кнопки.
    /*
    var removePointsButton = new ymaps.control.Button({
            data: {content: "Удалить промежуточные точки"},
            options: {selectOnClick: true}
        });*/

    // Объявляем обработчики для кнопок.
    /*
    removePointsButton.events.add('select', function () {
        multiRoute.model.setReferencePoints([
            referencePoints[0],
            referencePoints[referencePoints.length - 1]
        ], []);
    });

    removePointsButton.events.add('deselect', function () {
        referencePoints.push( 'Москва, улица Крылатские холмы');
        referencePoints.push( 'Москва, метро Молодежная');
        referencePoints.push( 'Москва, метро Пионерская');       
        
        multiRoute.model.setReferencePoints(referencePoints, viaIndexes);
        // Т.к. вторая точка была удалена, нужно заново ее настроить.
        //customizeSecondPoint();
    });*/

    
    /*
    // Подпишемся на событие обновления маршрута.
    // При возникновении события подписка удалится.
    multiRoute.events.once('update', function () {
    // Установим первый маршрут, у которого нет перекрытых
    // участков, в качестве активного. Откроем его балун.
    var routes = multiRoute.getRoutes();
    for (var i = 0, l = routes.getLength(); i < l; i++) {
        var route = routes.get(i);
        if (!route.properties.get('blocked')) {
            multiRoute.setActiveRoute(route);
            route.balloon.open();
            break;
        }
    }
});
    */