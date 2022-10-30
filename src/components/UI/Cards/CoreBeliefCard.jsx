import classes from "./CoreBeliefCard.module.css";

const CoreBeliefCard = props => {
   return (
      <div className={classes.card}>
         <h5 className={classes.heading}>{props.heading}</h5>
         <h6 className={classes.subHeading}>{props.subHeading}</h6>
      </div>
   );
};

export default CoreBeliefCard;
