import React from "react";
import { Fragment } from "react";

const CheckRow = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <Fragment>
      <input
        className="form-check"
        type="checkbox"
        ref={resolvedRef}
        {...rest}
      />
    </Fragment>
  );
});

export default CheckRow;
