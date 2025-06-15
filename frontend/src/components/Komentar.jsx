import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, Alert, Button, Form } from "react-bootstrap";
import { FaUserCircle, FaPaperPlane, FaReply } from "react-icons/fa";
import { MdEdit, MdDeleteForever } from "react-icons/md";

const Komentar = ({ benih_id, isAdmin = false }) => {
  const [fetchedComments, setFetchedComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [mainCommentContent, setMainCommentContent] = useState("");
  const [replyContents, setReplyContents] = useState({});
  const [showFormById, setShowFormById] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/get-comments/${benih_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFetchedComments(data.comments);
        setUserId(data.user_id);
      } else {
        setMessage(data.error || "Gagal memuat data komentar");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat memuat data:" + err);
    }
  }, [benih_id]);

  useEffect(() => {
    fetchComments();
  }, [benih_id, fetchComments]);

  // Memisahkan komentar utama dan balasan
  const mainComments = fetchedComments.filter((comment) => !comment.parent_id);
  const replies = fetchedComments.filter((comment) => comment.parent_id);

  const resetCommentForm = () => {
    setMainCommentContent("");
    setShowButton(false);
    setReplyContents({});
    setReplyingTo(null);
    setShowFormById(null);
    setEditingComment(null);
    setEditContent("");
  };

  const formatWIB = (timestamp) => {
    return new Date(
      new Date(timestamp).getTime() - 7 * 60 * 60 * 1000
    ).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    try {
      const content = replyingTo
        ? replyContents[showFormById] || ""
        : mainCommentContent;

      const response = await fetch("http://localhost:5000/add-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          benih_id: benih_id,
          content: content,
          parent_id: replyingTo,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        resetCommentForm();
        fetchComments();
      } else {
        setMessage(data.error || "Gagal mengirim komentar");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat mengirim komentar: " + err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
    setShowFormById(null);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const response = await fetch("http://localhost:5000/edit-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          comment_id: commentId,
          content: editContent,
          account_id: userId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Komentar berhasil diperbarui");
        resetCommentForm();
        fetchComments();
      } else {
        setMessage(data.error || "Gagal memperbarui komentar");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat memperbarui komentar: " + err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch("http://localhost:5000/delete-comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          comment_id: commentId,
          account_id: userId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Komentar berhasil dihapus");
        resetCommentForm();
        fetchComments();
      } else {
        setMessage(data.error || "Gagal menghapus komentar");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat menghapus komentar: " + err);
    }
  };

  // Fungsi untuk mengecek apakah user bisa mengedit komentar
  const canEditComment = (comment) => {
    return comment.account_id === userId;
  };

  // Fungsi untuk mengecek apakah user bisa menghapus komentar
  const canDeleteComment = (comment) => {
    return isAdmin || comment.account_id === userId;
  };

  return (
    <Container className="bg-white shadow my-5 p-4 col-12 col-md-10 col-lg-8 mx-auto">
      <h2 className="display-6 fw-semibold fs-3">Komentar</h2>

      <Form method="POST" onSubmit={handleAddComment} className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          name="content"
          value={mainCommentContent}
          onChange={(e) => setMainCommentContent(e.target.value)}
          placeholder={"Bagaimana pendapat Anda tentang benih ini?"}
          onInput={() => setShowButton(true)}
        />
        {showButton && (
          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={resetCommentForm}
            >
              Batal
            </Button>
            <Button
              variant="outline-success"
              type="submit"
              className="d-flex align-items-center"
              disabled={!mainCommentContent.trim()}
            >
              <FaPaperPlane className="me-2" />
              Kirim komentar
            </Button>
          </div>
        )}
      </Form>

      {message && (
        <Alert
          variant={message.includes("Gagal") ? "danger" : "success"}
          onClose={() => setMessage("")}
          dismissible
        >
          {message}
        </Alert>
      )}

      {mainComments.length === 0 ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Text className="text-center">
              Belum ada komentar untuk benih ini.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        mainComments.map((comment) => (
          <div key={`main-${comment.id}`}>
            <Card className="mt-3" style={{ border: "2px solid #388E3C" }}>
              <Card.Body>
                <Card.Title>
                  <FaUserCircle color="#388E3C" size={40} className="me-2" />
                  {comment.username}
                  <p className="float-end text-muted fs-6 fw-light">
                    {formatWIB(comment.updated_at)}
                  </p>
                </Card.Title>

                {editingComment === comment.id ? (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mb-2"
                    />
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={resetCommentForm}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="outline-success"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={!editContent.trim()}
                      >
                        Simpan Perubahan
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Card.Text>{comment.content}</Card.Text>
                    {showFormById !== comment.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => {
                            setShowFormById(comment.id);
                            setReplyingTo(comment.id);
                            setReplyContents((prev) => ({
                              ...prev,
                              [comment.id]: "",
                            }));
                          }}
                        >
                          <FaReply className="me-2" />
                          Balas Komentar
                        </Button>

                        <div className="float-end d-flex gap-3">
                          {canEditComment(comment) && (
                            <Button
                              variant="transparent"
                              style={{
                                color: "#388E3C",
                                border: "none",
                                padding: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() => handleEditComment(comment)}
                            >
                              <MdEdit color="#388E3C" className="me-1" />
                              Edit
                            </Button>
                          )}

                          {canDeleteComment(comment) && (
                            <Button
                              variant="transparent"
                              style={{
                                color: "#388E3C",
                                border: "none",
                                padding: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <MdDeleteForever
                                color="#388E3C"
                                className="me-1"
                              />
                              Hapus
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <Form
                        method="POST"
                        onSubmit={handleAddComment}
                        className="mt-2"
                      >
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="content"
                          value={replyContents[comment.id] || ""}
                          onChange={(e) =>
                            setReplyContents((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          placeholder={`Balas komentar ${comment.username}`}
                        />
                        <div className="d-flex justify-content-end mt-2">
                          <Button
                            variant="outline-secondary"
                            className="me-2"
                            onClick={resetCommentForm}
                          >
                            Batal
                          </Button>
                          <Button
                            variant="outline-success"
                            type="submit"
                            className="d-flex align-items-center"
                            disabled={!replyContents[comment.id]?.trim()}
                          >
                            <FaPaperPlane className="me-2" />
                            Kirim komentar
                          </Button>
                        </div>
                      </Form>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>

            {replies
              .filter((reply) => reply.parent_id === comment.id)
              .map((reply) => (
                <Card
                  key={`reply-${reply.id}`}
                  className="mt-2 ms-5"
                  style={{
                    border: "2px solid #388E3C",
                    borderLeft: "4px solid #388E3C",
                  }}
                >
                  <Card.Body>
                    <Card.Subtitle className="mb-2">
                      <FaUserCircle
                        color="#388E3C"
                        size={30}
                        className="me-2"
                      />
                      <p className="d-inline">{reply.username} </p>
                      <p className="text-muted d-inline fw-light">
                        (membalas {comment.username})
                      </p>
                      <p className="float-end text-muted fs-6 fw-light">
                        {formatWIB(reply.updated_at)}
                      </p>
                    </Card.Subtitle>

                    {editingComment === reply.id ? (
                      <>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="mb-2"
                        />
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outline-secondary"
                            className="me-2"
                            onClick={resetCommentForm}
                          >
                            Batal
                          </Button>
                          <Button
                            variant="outline-success"
                            onClick={() => handleUpdateComment(reply.id)}
                            disabled={!editContent.trim()}
                          >
                            Simpan Perubahan
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Card.Text>{reply.content}</Card.Text>
                        {showFormById !== reply.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => {
                                setShowFormById(reply.id);
                                setReplyingTo(comment.id);
                                setReplyContents((prev) => ({
                                  ...prev,
                                  [reply.id]: "",
                                }));
                              }}
                            >
                              <FaReply className="me-2" />
                              Balas Komentar
                            </Button>

                            <div className="float-end d-flex gap-3">
                              {canEditComment(reply) && (
                                <Button
                                  variant="transparent"
                                  style={{
                                    color: "#388E3C",
                                    border: "none",
                                    padding: 0,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={() => handleEditComment(reply)}
                                >
                                  <MdEdit color="#388E3C" className="me-1" />
                                  Edit
                                </Button>
                              )}

                              {canDeleteComment(reply) && (
                                <Button
                                  variant="transparent"
                                  style={{
                                    color: "#388E3C",
                                    border: "none",
                                    padding: 0,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={() => handleDeleteComment(reply.id)}
                                >
                                  <MdDeleteForever
                                    color="#388E3C"
                                    className="me-1"
                                  />
                                  Hapus
                                </Button>
                              )}
                            </div>
                          </>
                        ) : (
                          <Form
                            method="POST"
                            onSubmit={handleAddComment}
                            className="mt-2"
                          >
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="content"
                              value={replyContents[reply.id] || ""}
                              onChange={(e) =>
                                setReplyContents((prev) => ({
                                  ...prev,
                                  [reply.id]: e.target.value,
                                }))
                              }
                              placeholder={`Balas komentar ${reply.username}`}
                            />
                            <div className="d-flex justify-content-end mt-2">
                              <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={resetCommentForm}
                              >
                                Batal
                              </Button>
                              <Button
                                variant="outline-success"
                                type="submit"
                                className="d-flex align-items-center"
                                disabled={!replyContents[reply.id]?.trim()}
                              >
                                <FaPaperPlane className="me-2" />
                                Kirim komentar
                              </Button>
                            </div>
                          </Form>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>
              ))}
          </div>
        ))
      )}
    </Container>
  );
};

export default Komentar;
