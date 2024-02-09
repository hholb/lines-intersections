REMOTE_TARGET="hholbroo@arden.cs.unca.edu:/home/hholbroo/public_html/CSCI346.Spring2024/LinesAndIntersections"
LOCAL_DIR="."

rsync -av $LOCAL_DIR/index.html $LOCAL_DIR/styles.css $LOCAL_DIR/Main.js $LOCAL_DIR/Vector.js $REMOTE_TARGET/