[ (destructuring_bind (abc)
		    [(* 78 9)]
		      (+ abc 2))
704 ]


[ (destructuring_bind ((ev place) rest)
		      [[`abc `the_place] [[`rest1] [`rest2]]]
		      { `ev: ev `place: place `restis: rest })
{ ev: "abc", place: "the_place", restis: [ [ "rest1" ], [ "rest2" ] ] } ]

[ (contains? "defun" (sort (progn (declare (namespace core)) (symbols))))
true ]



