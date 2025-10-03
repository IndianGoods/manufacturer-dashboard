import { Fragment, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Menu, Transition } from '@headlessui/react'
import { cn } from '../../utils/helpers'

const Dropdown = ({ trigger, children, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 })
  const buttonRef = useRef(null)

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        right: window.innerWidth - rect.right - window.scrollX,
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isOpen])

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button 
          as="div" 
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          {trigger}
        </Menu.Button>
      </Menu>

      {isOpen && createPortal(
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            className="fixed z-[9999] w-48 rounded-md bg-white shadow-xl border border-gray-200 focus:outline-none"
            style={{
              top: position.top,
              [align === 'right' ? 'right' : 'left']: align === 'right' ? position.right : position.left,
            }}
          >
            <div className="py-1">
              {children}
            </div>
          </div>
        </Transition>,
        document.body
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

const DropdownItem = ({ children, onClick, className, ...props }) => {
  return (
    <button
      className={cn(
        'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

Dropdown.Item = DropdownItem

export default Dropdown