[[ `(destructuring_bind (abc)
		    [(* 78 9)]
		      (+ abc 2))
  704
  "destructuring bind simple"
  ]


[ `(destructuring_bind ((ev place) rest)
		      [[`abc `the_place] [[`rest1] [`rest2]]]
		      { `ev: ev `place: place `restis: rest })
 { ev: "abc", place: "the_place", restis: [ [ "rest1" ], [ "rest2" ] ] } 
 "destructuring bind nested with rest args 1"]

 [ `(destructuring_bind ((ev place) rest)
		      [[`abc `the_place] [[`rest1] [`rest2]]]
		      { `ev: ev `place: place `restis: rest })
 { ev: "abc", place: "the_place", restis: [ [ "rest1" ], [ "rest2" ] ] } 
 "destructuring bind nested and rest"]

  

 ]








