import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'moment';

type ArticleHeaderMetadataProps = {
  date: Date;
  timeToRead: number;
};

export const ArticleHeaderMetadata = ({
  date,
  timeToRead,
}: ArticleHeaderMetadataProps) => {
  return (
    <p className="flex text-sm text-gray-500 dark:text-gray-500">
      <span>
        <FontAwesomeIcon icon={faCalendar} className="mr-2"></FontAwesomeIcon>
        {Moment(date).format('MMMM D, YYYY')}
      </span>
      <span className="px-2">-</span>
      <span>
        <FontAwesomeIcon icon={faClock} className="mr-2"></FontAwesomeIcon>
        {timeToRead.toFixed(0)} min read
      </span>
    </p>
  );
};

