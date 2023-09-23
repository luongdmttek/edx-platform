/* global gettext */
/* eslint react/no-array-index-key: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

export function CourseOrLibraryListing(props) {
    const allowReruns = props.allowReruns;
    const linkClass = props.linkClass;
    const idBase = props.idBase;

    const courseRun = props.items.filter((item, index, self) => {
        return index === self.findIndex((t) => (
            t.run === item.run
          ))
        }
    )

    const courseOrg = props.items.filter((item, index, self) => {
        return index === self.findIndex((t) => (
            t.org === item.org
          ))
        }
    )

    const renderCourseMetadata = (item, i) => (
        <div>
            <h3 className="course-title" id={`title-${idBase}-${i}`}>{item.display_name}</h3>
            <div className="course-metadata">
                <span className="course-org metadata-item">
                    <span className="label">{gettext('Organization:')}</span>
                    <span className="value">{item.org}</span>
                </span>
                <span className="course-num metadata-item">
                    <span className="label">{gettext('Course Number:')}</span>
                    <span className="value">{item.number}</span>
                </span>
                { item.run &&
            <span className="course-run metadata-item">
                <span className="label">{gettext('Course Run:')}</span>
                <span className="value">{item.run}</span>
            </span>
                }
                { item.can_edit === false &&
            <span className="extra-metadata">{gettext('(Read-only)')}</span>
                }
            </div>
        </div>
    );

    return (
        <>
        { courseRun[0].hasOwnProperty('run') ? 
            <>
                <input type="text" id={`search-${idBase}`} placeholder="Search"></input>
                <div className="course-status">
                <span id="course-label">Course run:</span>
                <select name="filter_course_run" id={`filter-${idBase}-run`}>
                    <option key="all" value="all">All</option>
                    {
                        courseRun.map((item, i) => (
                            <option key={i} value={item.run}>{item.run}</option>
                        ))
                    }
                </select>
                </div>
                <div className="org-status">
                <span>Organization:</span>
                <select name="filter_course_org" id={`filter-${idBase}-org`}>
                    <option key="all" value="all">All</option>
                    {
                        courseOrg.map((item, i) => (
                            <option key={i} value={item.org}>{item.org}</option>
                        ))
                    }
                </select>
                </div>
            </> :
            <>
                <label className="library-note">
                    Libraries with prefixes [OFFICIAL] and [ACHIEVED] will go to corresponding filters, libraries without these prefixes will to the individual filter.
                </label>
                <input type="text" id={`search-${idBase}`} placeholder="Search"></input>
                <div className="library-status">
                <select name="filter_library" id={`filter-${idBase}`}>
                    <option value="official">Official</option>
                    <option value="archived">Archived</option>
                    <option value="personal">Personal</option>
                </select>
                </div>
            </>
        }
        <ul className="list-courses">
            {
                props.items.map((item, i) =>
                    (
                        <li key={i} 
                            className={ item.run ? `course-item ${item.run} ${item.org}` : `course-item` } 
                            data-course-key={item.course_key}>
                            {item.url
                                ? (
                                    <a className={linkClass} href={item.url}>
                                        {renderCourseMetadata(item, i)}
                                    </a>
                                )
                                : renderCourseMetadata(item, i)
                            }
                            { item.lms_link && item.rerun_link &&
              <ul className="item-actions course-actions">
                  { allowReruns &&
                <li className="action action-rerun">
                    <a
                        href={item.rerun_link}
                        className="button rerun-button"
                        aria-labelledby={`re-run-${idBase}-${i} title-${idBase}-${i}`}
                        id={`re-run-${idBase}-${i}`}
                    >{gettext('Re-run Course')}</a>
                </li>
                  }
                  <li className="action action-view">
                      <a
                          href={item.lms_link}
                          rel="external"
                          className="button view-button"
                          aria-labelledby={`view-live-${idBase}-${i} title-${idBase}-${i}`}
                          id={`view-live-${idBase}-${i}`}
                      >{gettext('View Live')}</a>
                  </li>
              </ul>
                            }
                        </li>
                    ),
                )
            }
        </ul>
        </>
    );
}

CourseOrLibraryListing.propTypes = {
    allowReruns: PropTypes.bool.isRequired,
    idBase: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    linkClass: PropTypes.string.isRequired,
};
