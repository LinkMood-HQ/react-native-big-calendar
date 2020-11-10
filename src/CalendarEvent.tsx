import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { commonStyles, OVERLAP_OFFSET } from './commonStyles'
import { DayJSConvertedEvent, Event, EventCellStyle } from './interfaces'
import {
  DAY_MINUTES,
  formatStartEnd,
  getRelativeTopInDay,
  getStyleForOverlappingEvent,
} from './utils'

function getEventCellPositionStyle({ end, start }: { end: dayjs.Dayjs; start: dayjs.Dayjs }) {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * end.diff(start, 'minute')
  const relativeTop = getRelativeTopInDay(start)
  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
  }
}

interface CalendarBodyProps<T> {
  event: DayJSConvertedEvent
  onPressEvent?: (event: Event<T>) => void
  eventCellStyle?: EventCellStyle<T>
  showTime: boolean
  eventCount?: number
  eventOrder?: number
  overlapOffset?: number
}

export const CalendarEvent = React.memo(
  ({
    event,
    onPressEvent,
    eventCellStyle,
    showTime,
    eventCount = 1,
    eventOrder = 0,
    overlapOffset = 0,
  }: CalendarBodyProps<any>) => {
    const getEventStyle = React.useMemo(
      () => (typeof eventCellStyle === 'function' ? eventCellStyle : (_: any) => eventCellStyle),
      [eventCellStyle],
    )

    const _onPress = React.useCallback(
      (event: DayJSConvertedEvent) => {
        onPressEvent && onPressEvent(event)
      },
      [event],
    )

    return (
      <TouchableOpacity
        delayPressIn={20}
        key={event.start.toString()}
        style={[
          commonStyles.eventCell,
          getEventCellPositionStyle(event),
          getStyleForOverlappingEvent(eventCount, eventOrder, overlapOffset),
          getEventStyle(event),
          event.isCalendarEvent && {backgroundColor:"#C1C2C6"}
        ]}
        onPress={() => _onPress(event)}
        disabled={!onPressEvent}
      >
        {event.isCalendarEvent ? (
          <Text style={commonStyles.eventTitle}>
            {event.title}{'\n'}<Text style={styles.eventTime}>{event.start.format('HH:mm')}</Text>
          </Text>
        ) : (
          <>
            <Text style={commonStyles.eventTitle}>{event.start.format('HH:mm')}</Text>
            {showTime && <Text style={{fontWeight:"600", color:"#fff"}}>{event.start.format('ddd DD MMM')}</Text>}
            {event.children && event.children}
          </>
        )}
      </TouchableOpacity>
    )
  },
)

const styles = StyleSheet.create({
  eventTime: {
    color: '#fff',
    fontSize: 10,
  },
})
